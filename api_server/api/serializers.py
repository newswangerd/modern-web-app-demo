from rest_framework import serializers
from api import models
from django.contrib.auth import get_user_model


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Task
        fields = "__all__"


class TaskListSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TaskList
        fields = (
            "id",
            "created",
            "last_updated",
            "name",
            "description",
        )

    def create(self, data):
        request = self.context.get('request')
        print(type(request.user.pk))

        data["user"] = request.user

        instance = super().create(data)
        return instance


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, style={'input_type': 'password'})


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password', 'placeholder': 'Password'}
    )

    class Meta:
        model = get_user_model()
        fields = (
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'password',
            'date_joined',
        )
        extra_kwargs = {
            'date_joined': {'read_only': True},
            'password': {'write_only': True, 'allow_blank': True, 'required': False}
        }

    def _set_password(self, instance, data):
        # password doesn't get set the same as other data, so delete it
        # before the serializer saves
        password = data.pop('password', None)
        if password:
            instance.set_password(password)
        return instance

    def create(self, data):
        instance = super().create(data)
        instance = self._set_password(instance, data)
        instance.save()
        return instance

    def update(self, instance, data):
        instance = self._set_password(instance, data)
        return super().update(instance, data)
