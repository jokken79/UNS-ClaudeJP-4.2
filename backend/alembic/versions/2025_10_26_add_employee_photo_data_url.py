"""Add photo_data_url column to employees table

Revision ID: 2025_10_26_add_employee_photo_data_url
Revises: 3c7e9f2b8a4d
Create Date: 2025-10-26 13:15:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "2025_10_26_add_employee_photo_data_url"
down_revision: Union[str, None] = "3c7e9f2b8a4d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add the optional photo_data_url column to employees."""

    with op.batch_alter_table("employees") as batch_op:
        batch_op.add_column(sa.Column("photo_data_url", sa.Text(), nullable=True))


def downgrade() -> None:
    """Remove the photo_data_url column when rolling back."""

    with op.batch_alter_table("employees") as batch_op:
        batch_op.drop_column("photo_data_url")

