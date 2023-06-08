from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from api.models import CustomUser


class TaskTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        user = CustomUser.objects.create_user(username='apitest')
        user.set_password("apitest")
        user.save()

    def test_list_tasks_forbidden(self):
        """
        Ensure tasks cannot be listed without authentication.
        """
        url = reverse('tasks-list')
        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_tasks_allowed(self):
        """
        Ensure tasks can be listed when authenticated.
        """
        url = reverse('tasks-list')
        client = self.client
        client.login(username='apitest', password='apitest')

        response = client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
