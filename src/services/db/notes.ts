import { DatabaseType, db } from './index';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Entry } from './types';

enum NoteKeys {
  ALL = 'notes',
  DETAIL = 'notes/detail',
}
