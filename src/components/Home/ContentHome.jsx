import  { useContext } from 'react'
import { ContextData } from '../../context/ContextApis'
import { useQuery } from '@tanstack/react-query'

export default function ContentHome() {
    const {getApiHome}=useContext(ContextData)

    const {data,isLoading,isError}=useQuery({
        queryKey: ['getApiHome'],
         queryFn: getApiHome})
         console.log(data?.data);
         
  return (
    <div>ContentHome</div>
  )
}
