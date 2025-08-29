'use client'
import { UpdateDockyFileData } from '@/db/schema/dockies';
import { IPropertiesTable } from '@/db/schema/property';
import useSWR from 'swr';
import { useTreesDefinition } from './definition';


/* eslint-disable @typescript-eslint/no-explicit-any */
export const fetcherPost = (payload: any) => {
  const options = {
    method: "POST",
    body: payload,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  }
  console.log('Call POST')
  return (uri: string) => {
    return fetch(uri, options).then((res) => res.json());
  }
}


const fetcher = (uri: string) => fetch(uri).then((res) => res.json());


export function useTrees(type: useTreesDefinition = useTreesDefinition.FullTree) {
  const { data, error, isLoading } = useSWR(`/api/dashboard/trees?type=${type}`, fetcher)

  return {
    data,
    isLoading,
    isError: error
  }
}

export function callTreePost(payload: IPropertiesTable) {
  //const { data, error, isLoading } = useSWR(`/api/dashboard/dockies`, fetcherPost(payload))
  const options = {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  }
  //TODO Improve by managing error and provide error message
  return fetch(`/api/dashboard/trees`, options).then((res) => res.json());
}

export function useDockies() {
  const { data, error, isLoading } = useSWR(`/api/dashboard/dockies`, fetcher)

  return {
    data,
    isLoading,
    isError: error
  }
}

export function useGetDockeyBySlug(slug: string) {
  //const { data, error, isLoading } = useSWR(`/api/dashboard/dockies?slug=${slug}`, fetcher)
  const { data, error, isLoading } = useSWR(slug!.length > 0 ? [`/api/dashboard/dockies?slug=${slug}`] : null, fetcher)

  return {
    data,
    isLoading,
    isError: error
  }
}

export function callDockiesPost(payload: UpdateDockyFileData, type: 'Docky' | 'FullTree' = 'FullTree') {
  payload.result = type;
  const options = {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  }
  //TODO Improve by managing error and provide error message
  return fetch(`/api/dashboard/dockies`, options).then((res) => res.json());
}
export function callDockiesPut(payload: UpdateDockyFileData) {
  //const { data, error, isLoading } = useSWR(`/api/dashboard/dockies`, fetcherPost(payload))
  const options = {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  }
  //TODO Improve by managing error and provide error message
  return fetch(`/api/dashboard/dockies`, options).then((res) => res.json());
}



// export function useProperties() {
//   const { data, error, isLoading } = useSWR(`/api/dashboard/trees`, fetcher)

//   return {
//     data,
//     isLoading,
//     isError: error
//   }
// }
