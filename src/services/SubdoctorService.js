import apiClient from "../api/apiClient";

export const createSubdoctor = async (formData) => {
  try {
    const response = await apiClient.post(`/api/subdoctors`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response?.data?.success) {
      return response?.data?.data;
    }
  } catch (error) {
    const apiError = error?.response?.data;

    if (Array.isArray(apiError?.errors)) {
      throw apiError.errors;
    }

    if (typeof apiError?.error === "string" || typeof apiError?.message === "string") {
      const planError = new Error(apiError.error || apiError.message || "Failed to add doctor");
      planError.code = apiError.code;
      throw planError;
    }
  }
};

export const updateSubdoctor=async(id,formData)=>{
    try {
        const response = await apiClient.put(`/api/subdoctors/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response?.data?.success) {
      return response?.data?.data;
    }
    } catch (error) {
        const apiError = error?.response?.data;

    if (Array.isArray(apiError?.errors)) {
      throw apiError.errors;
    }

    if (typeof apiError?.error === "string") {
      throw new Error(apiError.error || "Failed to update doctor");
    }
    }
}

export const changeDoctorStatus=async(id)=>{
    try {
        const response=await apiClient.patch(`/api/subdoctors/${id}/toggle-status`,{});
        if(response?.data?.success){
            return true;
        }
    } catch (error) {
        throw new Error(error?.response?.data?.error || "Failed to change doctor status")
    }
};

export const deleteSubDoctor=async(id)=>{
    try {
        const response=await apiClient.delete(`/api/subdoctors/${id}`);
        if(response?.data?.success){
            return true;
        }
    } catch (error) {
        throw new Error(error?.response?.data?.error || "Failed to delete doctor")
    }
}
