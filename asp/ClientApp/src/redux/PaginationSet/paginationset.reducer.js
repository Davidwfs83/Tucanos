import PaginationSetTypes from './paginationset.types';





export const EntitiesPerPage = 10;

const initialState = {
    Entities: {
        Admins: [],
        Airlines: [],
        Countries: [],
        Customers: [],
        Tickets: [],
        Flights: [],
        Reviews:[]
    },
    PageNumber: 1,
    EntitiesPerPage: 10,
    Query: {},
    CurrentEntities: {
        EntityType: "",
        EntityData: []
    }
};

export const PaginationSetReducer = (state = initialState, action) => {
    switch (action.type) {
        case PaginationSetTypes.ADD_ENTITY:
            {
                if (action.payload.EntityType == state.CurrentEntities.EntityType)
                    return {
                        ...state,
                        Entities: {
                            ...state.Entities,
                            [action.payload.EntityType]: action.payload.data
                        },
                        PageNumber: 1,
                        CurrentEntities: {
                            EntityType: action.payload.EntityType,
                            EntityData: action.payload.data.slice(0, EntitiesPerPage)
                        }
                    }
                else {
                    return {
                        ...state,
                        Entities: {
                            ...state.Entities,
                            [action.payload.EntityType]: action.payload.data
                        }
                    }
                }
            }
        case PaginationSetTypes.SET_DISPLAYING_ENTITY:
            return {
                ...state,
                EntitiesPerPage: action.payload.entitiesPerPage,
                CurrentEntities: {
                    EntityData: [],
                    EntityType: action.payload.entityType
                }
                
            }
        case PaginationSetTypes.UPDATE_SINGLE_ENTITY:
            {
                if (action.payload.EntityType !== state.CurrentEntities.EntityType)
                    return state
                else {
                    var updatedIndex = state.CurrentEntities.EntityData.findIndex(entity =>
                        entity[action.payload.IdName] === action.payload.EntityId
                    );
                    var newArr = [...state.CurrentEntities.EntityData];
                    newArr[updatedIndex] = { ...state.CurrentEntities.EntityData[updatedIndex], ...action.payload.data}
                    return {
                        ...state,
                        CurrentEntities: {
                            EntityType: state.CurrentEntities.EntityType,
                            EntityData: newArr
                        }
                    }
                }
            }

        case PaginationSetTypes.REMOVE_SINGLE_ENTITY:
            {
                if (action.payload.EntityType !== state.CurrentEntities.EntityType)
                    return state;
                else
                    return {
                        ...state,
                        CurrentEntities: {
                            EntityData: state.CurrentEntities.EntityData.filter(entity =>
                                entity[action.payload.IdName] !== action.payload.EntityId),
                            EntityType: state.CurrentEntities.EntityType
                        }
                    }
            }
        case PaginationSetTypes.SET_QUERY:
            return {
                ...state,
                Query: action.payload
            }
        case PaginationSetTypes.NEXT_PAGE:
            return {
                ...state,
                PageNumber: state.PageNumber + 1,
                CurrentEntities: {
                    EntityType: state.CurrentEntities.EntityType,
                    EntityData: state.Entities[state.CurrentEntities.EntityType].slice(EntitiesPerPage * state.PageNumber , EntitiesPerPage * (state.PageNumber + 1))
                }
            }
        case PaginationSetTypes.PREV_PAGE:
            return {
                ...state,
                PageNumber: state.PageNumber - 1,
                CurrentEntities: {
                    EntityType: state.CurrentEntities.EntityType,
                    EntityData: state.Entities[state.CurrentEntities.EntityType].slice(EntitiesPerPage * (state.PageNumber - 2), EntitiesPerPage * (state.PageNumber - 1))
                }
            }
        case PaginationSetTypes.RESET_PAGAINTION_SET:
            {
                return initialState
            }                       
        default:
            return state;

    }
}

