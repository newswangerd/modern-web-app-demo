from django.urls import path, include

from api import views

auth_views = [
    path("login/", views.LoginView.as_view(), name="auth-login"),
    path("logout/", views.LogoutView.as_view(), name="auth-logout"),
    path("sign-up/", views.MeViewset.as_view({"post": "create"})),
    path("me/", views.MeViewset.as_view({"put": "update", "get": "retrieve"})),
]

v1 = [
    path('auth/', include(auth_views)),
    path("tasks/", views.TaskViewset.as_view({"get": "list", "post": "create"}), name="tasks-list"),
    path("tasks/<str:pk>/", views.TaskViewset.as_view({
            "get": "retrieve",
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy"
        }), name="tasks-detail"),
    path("task-lists/", views.TaskListViewset.as_view({"get": "list", "post": "create"}), name="task-lists-list"),
    path("task-lists/<str:pk>/", views.TaskListViewset.as_view({
            "get": "retrieve",
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy",
        }), name="task-lists-list"),
]

urlpatterns = [
    path("v1/", include((v1, 'api'), namespace='v1')),
]
