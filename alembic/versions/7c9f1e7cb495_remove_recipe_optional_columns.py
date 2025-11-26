"""remove recipe optional columns

Revision ID: 7c9f1e7cb495
Revises: d648660b4f7b
Create Date: 2025-11-26 15:51:55.120895

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7c9f1e7cb495'
down_revision: Union[str, Sequence[str], None] = 'd648660b4f7b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    with op.batch_alter_table('foods') as batch_op:
        batch_op.drop_column('calories_per_gram')
        batch_op.drop_column('carbohydrates')
        batch_op.drop_column('protein')
        batch_op.drop_column('fat')
        batch_op.drop_column('sodium')
        batch_op.drop_column('vitamin_c')
        batch_op.drop_column('vitamin_d')
        batch_op.drop_column('zinc')

    with op.batch_alter_table('recipes') as batch_op:
        batch_op.drop_column('calories_per_gram')
        batch_op.drop_column('time')
        batch_op.drop_column('difficulty')
        batch_op.drop_column('description')
        batch_op.drop_column('tags')


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('recipes') as batch_op:
        batch_op.add_column(sa.Column('tags', sa.JSON(), nullable=True))
        batch_op.add_column(sa.Column('description', sa.String(length=1000), nullable=True))
        batch_op.add_column(sa.Column('difficulty', sa.String(length=50), nullable=True))
        batch_op.add_column(sa.Column('time', sa.Integer(), nullable=False))
        batch_op.add_column(sa.Column('calories_per_gram', sa.Float(), nullable=True))

    with op.batch_alter_table('foods') as batch_op:
        batch_op.add_column(sa.Column('zinc', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('vitamin_d', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('vitamin_c', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('sodium', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('fat', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('protein', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('carbohydrates', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('calories_per_gram', sa.Float(), nullable=True))
