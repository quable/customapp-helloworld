export const customFetch = async (url, options, additionalHeaders = {}) => {
    const response = { data: null, error: null };

    try {
        const resp = await fetch(url, {
            ...options,
            headers: {
                ...additionalHeaders,
            }
        });

        const data = await resp.json();
        if (resp.ok) {
            response.data = data?.data ? data.data : data;
        } else {
            response.error = data.message || data.error;
        }
    } catch (error) {
        console.log(error)
        response.error = 'Please try again later';
    }

    return response;
}