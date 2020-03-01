
import * as RNFS from 'react-native-fs';
import { Platform } from "react-native"

const copyResourcesToScormServerPath = async () => {
    console.log('copyFilesToHtmlDirectory called........!');
    const scormPlayerRoot = getScormPlayerRoot();
    const files = [
        'index.html',
        'loading_scorm.html',
        'scorm_12.js',
        'complexscorm.zip',
    ];

    await RNFS.mkdir(scormPlayerRoot);
    if (Platform.OS === 'android') {
        await RNFS.mkdir(`${scormPlayerRoot}/complexscorm`);
    } else {
        if (await RNFS.exists(`${scormPlayerRoot}/complexscorm`)) {
            await RNFS.unlink(`${scormPlayerRoot}/complexscorm`);
        }
    }
    const result = files.map(async file => {
        const targetFileOnServerRoot = `${scormPlayerRoot}/${file}`;
        const isExist = await RNFS.exists(targetFileOnServerRoot);
        console.log('targetFileOnServerRoot: ', targetFileOnServerRoot, '\n');
        if (isExist) {
            return RNFS.unlink(targetFileOnServerRoot).then(() => {
                return copyScormFileToServerPath(file);
            });
        } else {
            return copyScormFileToServerPath(file);
        }
    });
    return Promise.all(result);
};
const copyScormFileToServerPath = async (file: string) => {
    console.log('coping file........');
    const scormSourceFile = `${getScormSourceDirectory()}/${file}`;
    const targetFileOnServerRoot = `${getScormPlayerRoot()}/${file}`;
    if (Platform.OS === 'android') {
        return RNFS.copyFileAssets(`${scormSourceFile}`, targetFileOnServerRoot);
    } else {
        return RNFS.copyFile(`${scormSourceFile}`, targetFileOnServerRoot);
    }
};

const getScormPlayerRoot = () => RNFS.DocumentDirectoryPath + '/html';
const getScormSourceDirectory = () => Platform.OS === 'android' ? 'html' : RNFS.MainBundlePath + '/html';

export {copyResourcesToScormServerPath, getScormPlayerRoot}
