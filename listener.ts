import { createClient } from '@supabase/supabase-js';

import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

async function main() {
  console.log('Listening for new messages...');

  supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public'},
      (payload) => {
        console.log('Change received!', payload);
      },
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', },
      (payload) => console.log('Lowercase event:', payload),
    )
    .subscribe((status) => {
      console.log('Subscription status:', status);
    });
}

main();

setInterval(() => {}, 1000);
