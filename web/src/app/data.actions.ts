'use server'

import {pool} from '../cockroach/utils';

export type Postings = {
    job_id: string,
    job_title: string,
    company: string,
    date_posted: string,
    city: string,
    search_query_id: string | null
}

export type PostingsCount = {
    count: number
}

export type CityGroups = {
    city: string,
    posting_count: number,
    latitude: number,
    longitude: number
}

export type JobTitleGroups = {
    job_title: string,
    posting_count: number
}


export async function getData(){
    const res = await pool.query(
        `SELECT COUNT(*) from postings;
        `);

    return res.rows[0] as PostingsCount;
}

export async function aggregateByCity(){
    const res = await pool.query(`
        SELECT sq.city, COUNT(*) as posting_count, sq.latitude, sq.longitude
        FROM search_queries sq
        LEFT JOIN postings p ON sq.id = p.search_query_id
        GROUP BY sq.city, sq.latitude, sq.longitude
        ORDER BY posting_count DESC
        `);

    return res.rows as CityGroups[];
}

export async function aggregateByTitle(){
    const res = await pool.query(`
       SELECT sq.search as job_title, COUNT(*) as posting_count
       FROM search_queries sq
       LEFT JOIN postings p ON sq.id = p.search_query_id
       GROUP BY sq.search
       ORDER BY posting_count DESC 
        `)

    return res.rows as JobTitleGroups[];
}