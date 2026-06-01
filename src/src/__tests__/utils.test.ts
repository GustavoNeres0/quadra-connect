import { cn } from '@/lib/utils';

describe('cn (classnames)', () => {

  it('combina classes normalmente', () => {
    expect(cn('text-red-500', 'font-bold')).toBe('text-red-500 font-bold');
  });

  it('ignora valores falsy', () => {
    expect(cn('text-red-500', false, undefined)).toBe('text-red-500');
  });

});