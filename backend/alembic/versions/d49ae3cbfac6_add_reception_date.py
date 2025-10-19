"""add_reception_date

Revision ID: d49ae3cbfac6
Revises: initial_baseline
Create Date: 2025-10-19 02:21:53.718800

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd49ae3cbfac6'
down_revision: Union[str, None] = 'initial_baseline'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add the missing reception_date column to candidates table
    op.add_column('candidates', sa.Column('reception_date', sa.Date(), nullable=True))


def downgrade() -> None:
    # Remove the reception_date column
    op.drop_column('candidates', 'reception_date')
