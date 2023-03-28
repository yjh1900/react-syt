import { request } from '@/utils/http'
import { HospitalListRes, HospitalItem } from './model/hospitalTypes'

export const getHospitalSetListApi = (page: number, limit: number, hosname?: string, hoscode?: string) => {
  return request.get<any, HospitalListRes>(`/admin/hosp/hospitalSet/${page}/${limit}`, { params: { hosname, hoscode } })
}

export const addHospitalSetListApi = (data: HospitalItem) => {
  return request.post<any, null>(`/admin/hosp/hospitalSet/save`, data)
}

export const updateHospitalSetListApi = (data: HospitalItem) => {
  return request.put<any, null>(`/admin/hosp/hospitalSet/update`, data)
}
