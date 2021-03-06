import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
function useDataFetching(dataSource, delay) {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState();
  const [error, setError] = useState(false);
  const config = axios.create({
    timeout: 5000,
    CancelToken: source.token,
  });

  const makeRequest = useCallback(
    async (method, data, headers) => {
      try {
        const response = await axios({
          url: dataSource,
          method,
          headers,
          data,
          config,
        });

        if (response.data.status !== 'success') throw response.data.message;
        setResults(response.data);
        setLoading(false);
        return response.data;
      } catch (err) {
        setError({ error: true, message: err });
        setLoading(false);
      }
    },
    [dataSource, config]
  );

  useEffect(() => {
    async function fetchData() {
      if (delay) return;
      try {
        const response = await axios.get(dataSource, config);
        if (response.data.status !== 'success') throw response.data.message;
        setResults([...response.data.data]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error);
      }
    }
    fetchData();
  }, [dataSource]);
  return {
    loading,
    results,
    error,
    makeRequest,
  };
}
export default useDataFetching;
