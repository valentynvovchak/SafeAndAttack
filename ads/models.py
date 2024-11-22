from django.db import models
from django.utils.html import escape

class Ad(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)  # Дата створення

    def clean(self):
        # Захист від XSS
        self.title = escape(self.title)
        self.description = escape(self.description)

    def __str__(self):
        return self.title
