'use server'

import {pool} from '../cockroach/utils';

export type Postings = {
    job_id: string,
    job_title: string,
    company: string,
    date_posted: string,
    location: string,
    search_query_id: string | null
}


export async function getData(){
    const res = await pool.query('SELECT * FROM postings');
    return res.rows as Postings[];
}