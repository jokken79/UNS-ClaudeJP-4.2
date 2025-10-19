"""add_missing_columns_to_candidates

Revision ID: 7b5286821f25
Revises: d49ae3cbfac6
Create Date: 2025-10-19 02:29:58.117908

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7b5286821f25'
down_revision: Union[str, None] = 'd49ae3cbfac6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add the missing arrival_date column to candidates table
    op.add_column('candidates', sa.Column('arrival_date', sa.Date(), nullable=True))


def downgrade() -> None:
    # Remove the arrival_date column
    op.drop_column('candidates', 'arrival_date')
