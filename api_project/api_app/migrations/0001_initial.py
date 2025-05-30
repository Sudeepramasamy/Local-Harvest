# Generated by Django 5.1.6 on 2025-02-18 08:34

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Turf',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
                ('location', models.CharField(max_length=30)),
                ('price', models.DecimalField(decimal_places=2, max_digits=6)),
                ('available', models.BooleanField(default=True)),
            ],
        ),
    ]
