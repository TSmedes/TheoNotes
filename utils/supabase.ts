
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from "@react-native-async-storage/async-storage";


export const supabase = createClient(
    'https://zfmugsyfplrzchrovtlw.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmbXVnc3lmcGxyemNocm92dGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIxOTcyNDEsImV4cCI6MjAzNzc3MzI0MX0.MtYBMPk6iH8BgKB9RxH66kR_HsB0h2hb0z-QYEFI2eQ', 
    
{
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
