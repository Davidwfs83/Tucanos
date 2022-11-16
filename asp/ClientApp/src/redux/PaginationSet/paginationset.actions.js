import PaginationSetTypes from './paginationset.types';

export function AddEntity(data, entityType) {
    return {
        type: PaginationSetTypes.ADD_ENTITY,
        payload: {
            EntityType: entityType,
            data
        }
    }
}

export function UpdateSingleEntity(data, entityType="", entityId, idName) {
    return {
        type: PaginationSetTypes.UPDATE_SINGLE_ENTITY,
        payload: {
            EntityType: entityType,
            data,
            EntityId: entityId,
            IdName: idName
        }
    }
}

export function RemoveSingleEntity(entityType = "", entityId, idName) {
    return {
        type: PaginationSetTypes.REMOVE_SINGLE_ENTITY,
        payload: {
            EntityType: entityType,
            EntityId: entityId,
            IdName: idName
        }
    }
}

export function SetDisplayingEntity(entityType, entitiesPerPage = 10) {
    return {
        type: PaginationSetTypes.SET_DISPLAYING_ENTITY,
        payload:
        {
            entityType,
            entitiesPerPage
        }
    }
}

export function NextPage() {
    return {
        type: PaginationSetTypes.NEXT_PAGE
    }
}

export function PrevPage() {
    return {
        type: PaginationSetTypes.PREV_PAGE
    }
}

export function SetQuery(query) {
    return {
        type: PaginationSetTypes.SET_QUERY,
        payload: query
    }
}
export function ResetPaginationSet() {
    return {
        type: PaginationSetTypes.RESET_PAGAINTION_SET
    }
}
