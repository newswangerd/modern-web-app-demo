from django.urls import path, include

from api import viewsets

auth_views = [
    path("login/", viewsets.LoginView.as_view(), name="auth-login"),
    path("logout/", viewsets.LogoutView.as_view(), name="auth-logout"),
    path("sign-up/", viewsets.MeViewset.as_view({"post": "create"})),
    path("me/", viewsets.MeViewset.as_view({"put": "update", "get": "retrieve"})),
]

v1 = [
    path('auth/', include(auth_views)),
    path("tasks/", viewsets.TaskViewset.as_view({"get": "list", "post": "create"}), name="tasks-list"),
    path("tasks/<str:pk>/", viewsets.TaskViewset.as_view({"get": "retrieve", "put": "update"}), name="tasks-detail"),
    path("task-lists/", viewsets.TaskListViewset.as_view({"get": "list", "post": "create"}), name="task-lists-list"),
    path("task-lists/<str:pk>/", viewsets.TaskListViewset.as_view({"get": "retrieve", "put": "update"}), name="task-lists-list"),
]

urlpatterns = [
    path("v1/", include(v1)),
]