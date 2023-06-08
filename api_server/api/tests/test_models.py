from django.db.utils import IntegrityError

from ..models import CustomUser, TaskList, Task

import pytest


@pytest.mark.django_db
def test_custom_user_creation():
    user = CustomUser.objects.create_user(username='test', password='test', email='test@test.com')
    assert 'test', user.username
    assert 'test@test.com', user.email


@pytest.mark.django_db
def test_custom_user_email_is_unique():
    CustomUser.objects.create_user(username='test', password='test', email='test@test.com')

    with pytest.raises(IntegrityError):
        CustomUser.objects.create_user(username='test2', password='test2', email='test@test.com')


@pytest.mark.django_db
def test_task_list_creation():
    user = CustomUser.objects.create_user(username='test', password='test', email='test@test.com')
    task_list = TaskList.objects.create(
        name='Groceries',
        description='We\'re starving, time to go to the supermarket',
        user=user,
    )

    task = Task.objects.create(
        name='tomatoes',
        description='Get italian tomatoes, not the cherry ones.',
        is_complete=False,
        list=task_list,
    )

    assert 'Groceries', task_list.name
    assert 'We\'re starving, time to go to the supermarket', task_list.description
    assert user, task_list.user

    assert 'tomatoes', task.name
    assert 'Get Italian tomatoes, not the cherry ones.', task.description
