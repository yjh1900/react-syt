import { request } from '@/utils/http'
import { HospitalListRes } from './model/hospitalTypes'

export const getHospitalSetListApi = (page: number, limit: number, hosname?: string, hoscode?: string) => {
  return request.get<any, HospitalListRes>(`/admin/hosp/hospitalSet/${page}/${limit}`, { params: { hosname, hoscode } })
}
