import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonLabel, IonInput, IonToggle, IonItem, IonList, IonButtons, IonBackButton } from '@ionic/react';
import { useSettings } from '../context/SettingsContext';
import './styles/Settings.css';

const Settings: React.FC = () => {
	const settings = useSettings();

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton defaultHref="/" />
					</IonButtons>
					<IonTitle>Settings</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<IonCard>
					<IonCardContent>
						<IonList>
							{settings.map((setting, index) => {
								let inputElement;

								if (typeof setting.value === 'boolean') {
									inputElement = (
										<IonToggle
											checked={setting.value}
											onIonChange={e => setting.setValue(e.detail.checked)}
										/>
									);
								} else {
									inputElement = (
										<IonInput
											class="setting-input"
											value={setting.value.toString()}
											placeholder={setting.name}
											onIonChange={e => setting.setValue(e.detail.value)}
										/>
									);
								}

								return (
									<IonItem key={index} className={typeof setting.value === 'boolean' ? 'toggle-setting' : 'text-setting'}>
										<IonLabel class="setting-name">{setting.name}</IonLabel>
										{inputElement}
									</IonItem>
								);
							})}
						</IonList>
					</IonCardContent>
				</IonCard>
			</IonContent>
		</IonPage>
	);
};

export default Settings;
