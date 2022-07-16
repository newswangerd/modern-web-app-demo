from operator import mod
from django.db import models
import uuid
from django.conf import settings
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True, null=False, blank=False)


class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        abstract = True


class TaskList(BaseModel):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )


class Task(BaseModel):
    name = models.CharField(max_length=200, null=False)
    description = models.TextField(null=True)
    is_complete = models.BooleanField(default=False)
    due_date = models.DateTimeField(null=True)
    parent_task = models.ForeignKey("self", on_delete=models.CASCADE, null=True)
    list = models.ForeignKey(TaskList, on_delete=models.CASCADE)
