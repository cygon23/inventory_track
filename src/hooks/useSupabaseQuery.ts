import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface QueryResult<T> {
  data: T[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useSupabaseQuery<T = any>(
  table: string,
  select: string = '*',
  filters?: (query: any) => any,
  options?: { single?: boolean; order?: { column: string; ascending?: boolean } }
): QueryResult<T> {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let query: any = supabase.from(table).select(select)
      if (options?.order) {
        query = query.order(options.order.column, { ascending: options.order.ascending ?? true })
      }
      if (filters) {
        query = filters(query)
      }
      const { data, error } = await query
      if (error) throw error
      setData((data as unknown as T[]) ?? [])
    } catch (err: any) {
      setError(err?.message ?? 'Unknown error')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [table, select, filters, options?.order])

  useEffect(() => {
    run()
  }, [run])

  return { data, loading, error, refresh: run }
}

