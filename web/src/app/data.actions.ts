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

export type JobsForCitiesByDate = {
    date_posted: string,
    city: string,
    job_postings_for_date: number
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

export async function aggregateByDate(){
    const res = await pool.query(`
        SELECT p.date_posted, sq.city, COUNT(*) job_postings_for_date
        FROM postings p
        LEFT JOIN search_queries sq ON sq.id = p.search_query_id
        WHERE sq.city = 'san francisco' OR sq.city = 'new york city' OR sq.city = 'chicago' OR sq.city = 'seattle'
        GROUP BY p.date_posted, sq.city
        ORDER BY job_postings_for_date DESC
        `)
    
    return res.rows as JobsForCitiesByDate[];
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