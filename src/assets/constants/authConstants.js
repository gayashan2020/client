export const userRoles = {
    ADMIN: 'admin',
    STUDENT: 'student',
    MENTOR: 'mentor',
    CPD_PROVIDER: 'cpd_provider',
    SUPER_ADMIN: 'super_admin',
}

export const userStatus = {
    PENDING_APPROVAL: {
        value: 'pending_approval',
        label: 'Pending Approval',
        style: { color: 'orange', backgroundColor: 'rgba(255, 165, 0, 0.1)' }
    },
    ACTIVE: {
        value: 'active',
        label: 'Active',
        style: { color: 'green', backgroundColor: 'rgba(0, 128, 0, 0.1)' }
    },
    DISABLED: {
        value: 'disabled',
        label: 'Disabled',
        style: { color: 'gray', backgroundColor: 'rgba(128, 128, 128, 0.1)' }
    },
    DELETED_NO_APPEAL: {
        value: 'deleted_no_appeal',
        label: 'Deleted No Appeal',
        style: { color: 'red', backgroundColor: 'rgba(255, 0, 0, 0.1)' }
    },
    DELETED_APPEALED: {
        value: 'deleted_appealed',
        label: 'Deleted Appealed',
        style: { color: 'blue', backgroundColor: 'rgba(0, 0, 255, 0.1)' }
    }
};