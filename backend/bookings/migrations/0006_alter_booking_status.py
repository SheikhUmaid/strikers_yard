from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookings', '0005_alter_booking_unique_together'),
    ]

    operations = [
        migrations.AlterField(
            model_name='booking',
            name='status',
            field=models.CharField(
                choices=[
                    ('pending', 'Pending'),
                    ('partial', 'Partially Paid'),
                    ('paid', 'Paid'),
                    ('cancelled', 'Cancelled'),
                ],
                default='pending',
                max_length=10,
            ),
        ),
    ]

