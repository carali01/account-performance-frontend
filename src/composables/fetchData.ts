// import { ref } from "vue";

/* Fetch data with with given url, return response data */

export async function fetchData<T>(url: string): Promise<T | null> {

    try {
        const response = await fetch(url, { method: 'GET' });
        // const data = ref({})
        if (response.ok) {
            return await response.json() as T
        }
        else {
            const err = await response.json();
            alert(err.message)
            return null
        }
        // return data.value
    } catch (err) {
        alert(err)
        return null
    }
}