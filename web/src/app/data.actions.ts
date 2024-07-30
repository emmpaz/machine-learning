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

export async function aggregateByDate(){
    const res = await pool.query(`
        SELECT p.date_posted, sq.city, COUNT(*) job_postings_for_date
        FROM postings p
        LEFT JOIN search_queries sq ON sq.id = p.search_query_id
        WHERE sq.city = 'new york city' OR sq.city = 'san francisco' OR sq.city = 'seattle' OR sq.city = 'salt lake city' OR sq.city = 'chicago'
        GROUP BY p.date_posted, sq.city
        ORDER BY p.date_posted
        `)
    
        const rows = res.rows as {
            date_posted: string,
            city: string,
            job_postings_for_date: number
        }[];

        const transformedData = [] as {
            date_posted: string,
            [city: string]: number | string
        }[];

        const cityList = new Set<string>();
    
        rows.forEach(row => {
            let dateEntry = transformedData.find(entry => entry.date_posted === row.date_posted);
            if (!dateEntry) {
                dateEntry = { date_posted: row.date_posted };
                transformedData.push(dateEntry);
            }
            cityList.add(row.city);
            dateEntry[row.city] = row.job_postings_for_date;
        });
        return {transformedData, cityList};
}

export type JobsForCitiesByDate = {
    date_posted: string,
    city: string,
    job_postings_for_date: number
}