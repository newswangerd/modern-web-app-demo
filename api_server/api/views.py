from rest_framework import viewsets, generics, mixins, views
from api import models
from api import serializers
from django.contrib.auth import get_user_model

from django.core.exceptions import PermissionDenied

from django.contrib import auth as django_auth
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.authentication import SessionAuthentication

from rest_framework.response import Response
from rest_framework import status as http_code


class _CSRFSessionAuthentication(SessionAuthentication):
    """CSRF-enforcing version of a SessionAuthentication class."""

    def authenticate(self, request):
        user = getattr(request._request, "user", None)
        self.enforce_csrf(request)
        return user, None


class MeViewset(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.RetrieveModelMixin):
    serializer_class = serializers.UserSerializer
    queryset = get_user_model().objects.all()

    # Disable login requirement to allow users to signup
    permission_classes = []

    def get_object(self):
        """
        Returns the object the view is displaying.

        You may want to override this if you need to provide non-standard
        queryset lookups.  Eg if objects are referenced using multiple
        keyword arguments in the url conf.
        """

        user = self.request.user

        if user.is_anonymous:
            raise PermissionDenied

        return self.request.user

    def create(self, request):
        serializer = self.get_serializer(data=self.request.data)

        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = django_auth.authenticate(request, username=username, password=password)
        if user is None:
            return Response(status=http_code.HTTP_403_FORBIDDEN)

        django_auth.login(request, user)

        return Response(serializer.data, status=http_code.HTTP_201_CREATED, headers=headers)


class LoginView(generics.GenericAPIView):
    serializer_class = serializers.LoginSerializer
    authentication_classes = (_CSRFSessionAuthentication,)
    permission_classes = []

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        return Response(status=http_code.HTTP_204_NO_CONTENT)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=self.request.data)

        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = django_auth.authenticate(request, username=username, password=password)
        if user is None:
            return Response(status=http_code.HTTP_403_FORBIDDEN)

        django_auth.login(request, user)

        return Response(status=http_code.HTTP_204_NO_CONTENT)


class LogoutView(views.APIView):
    def post(self, request, *args, **kwargs):
        django_auth.logout(request)
        return Response(status=http_code.HTTP_204_NO_CONTENT)


class TaskViewset(viewsets.ModelViewSet):
    queryset = models.Task.objects.all()
    serializer_class = serializers.TaskSerializer

    def get_queryset(self):
        return self.queryset.filter(list__user=self.request.user)


class TaskListViewset(viewsets.ModelViewSet):
    queryset = models.TaskList.objects.all()
    serializer_class = serializers.TaskListSerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
