import AsyncStorage from "@react-native-community/async-storage";
const TOTARA_RESOURCES = '@TOTARA_OFFLINE_RESOURCES';

const RetrieveStorage = () =>{
    return AsyncStorage.getItem(TOTARA_RESOURCES);
};

const RetrieveStorageDataById = (id: string) =>{
    return RetrieveStorage().then(storedData => {
        if (storedData && JSON.parse(storedData)) {
            return JSON.parse(storedData)[id];
        } else {
            return null;
        }
    });
};

const SaveStorage = (id: string, data: Object) =>{
    return RetrieveStorage().then(storedData => {
        let newData = {[id]: data}
        if (storedData && JSON.parse(storedData)) {
            newData = {...JSON.parse(storedData), ...newData};
        }
        return AsyncStorage.setItem(TOTARA_RESOURCES, JSON.stringify(newData));
    });
};

const DeleteStorage = (id: string) =>{
    return RetrieveStorage().then(storedData => {
        if (storedData && JSON.parse(storedData)) {
            const files = JSON.parse(storedData);
            delete files[id];
            return AsyncStorage.setItem(TOTARA_RESOURCES, JSON.stringify(files));
        }
    });
};

export {RetrieveStorage, RetrieveStorageDataById, SaveStorage, DeleteStorage}