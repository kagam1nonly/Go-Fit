from django.test import TestCase
from django.urls import reverse

class AccountFormTests(TestCase):
    def test_account_form_url(self):
        response = self.client.get(reverse('account_form'))
        self.assertEqual(response.status_code, 200)