import { View, Text } from 'react-native';
import MainView from './(components)/MainView';
import SText from './(components)/SText';
import Button from './(components)/Button';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
    const { t } = useTranslation();
    return (
        <MainView>
            <SText>Not Found</SText>
            <Button text={t('GO_HOME')} onPress={() => { router.replace("/home") }} />
        </MainView>
    );
};

export default NotFound;