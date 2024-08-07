import service from '@/utils/request'

export const chargepalAPI = {

    registerUser(Obj) {
        return service({
            url: '/api/v1/register',
            method: 'post',
            data: Obj
        })
    },


    login(Obj) {
        return service({
            url: '/api/v1/login',
            method: 'post',
            data: Obj
        })
    },

    subscribe() {
        return service({
            url: '/api/v1/user/membership/buy',
            method: 'post',
        })
    },


    getUserInfo() {
        return service({
            url: '/api/v1/user/info',
            method: 'get'
        })
    },


    bindEmali(Obj) {
        return service({
            url: '/api/v1/link/verification/request',
            method: 'post',
            data: Obj
        })
    },


    bindCode(Obj) {
        return service({
            url: '/api/v1/link/verification/verify',
            method: 'post',
            data: Obj
        })
    },


    /////////////////////////
    getAsset(id) {
        return service({
            url: `/api/v1/asset/${id}`,
            method: 'get'
        })
    },

    userMem() {
        return service({
            url: '/api/v1/user/membership/buy',
            method: 'post'
        })
    },

    userAsset() {
        return service({
            url: '/api/v1/user/asset',
            method: 'get'
        })
    },

    getReward(id) {
        return service({
            url: `/api/v1/reward/nft/${id}`,
            method: 'get'
        })
    },

    getUserRewardAndProof(id) {
        return service({
            url: `/api/v1/reward/user/${id}`,
            method: 'get'
        })
    },

    uploadUsage() {
        return service({
            url: '/api/v1/upload/file/usage',
            method: 'post'
        })
    },

}