import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Platform, Text, View, StyleSheet } from 'react-native';
import Coachmark from '../Coachmark';
import setOnboardingWizardStep from '../../../../actions/wizard';
import { colors, fontStyles } from '../../../../styles/common';
import { renderAccountName } from '../../../../util/address';
import AccountOverview from '../../AccountOverview';
import { strings } from '../../../../../locales/i18n';
import onboardingStyles from './../styles';

const styles = StyleSheet.create({
	main: {
		flex: 1
	},
	some: {
		marginHorizontal: 45
	},
	coachmarkContainer: {
		flex: 1,
		position: 'absolute',
		left: 0,
		right: 0,
		top: Platform.OS === 'ios' ? 210 : 180
	},
	accountLabelContainer: {
		alignItems: 'center',
		marginTop: Platform.OS === 'ios' ? 88 : 57,
		backgroundColor: colors.white
	}
});

class Step3 extends Component {
	static propTypes = {
		/**
		 * String that represents the selected address
		 */
		selectedAddress: PropTypes.string,
		/**
		/* Identities object required to get account name
		*/
		identities: PropTypes.object,
		/**
		 * Map of accounts to information objects including balances
		 */
		accounts: PropTypes.object,
		/**
		 * Currency code of the currently-active currency
		 */
		currentCurrency: PropTypes.string,
		/**
		 * Dispatch set onboarding wizard step
		 */
		setOnboardingWizardStep: PropTypes.func
	};

	state = {
		accountLabel: '',
		accountLabelEditable: false
	};

	/**
	 * Sets corresponding account label
	 */
	componentDidMount = () => {
		const { identities, selectedAddress } = this.props;
		const accountLabel = renderAccountName(selectedAddress, identities);
		this.setState({ accountLabel });
	};

	/**
	 * Dispatches 'setOnboardingWizardStep' with next step
	 */
	onNext = () => {
		const { setOnboardingWizardStep } = this.props;
		setOnboardingWizardStep && setOnboardingWizardStep(4);
	};

	/**
	 * Dispatches 'setOnboardingWizardStep' with back step
	 */
	onBack = () => {
		const { setOnboardingWizardStep } = this.props;
		setOnboardingWizardStep && setOnboardingWizardStep(2);
	};

	/**
	 * Returns content for this step
	 */
	content = () => (
		<View style={onboardingStyles.contentContainer}>
			<Text style={onboardingStyles.content}>{strings('onboarding_wizard.step3.content1')}</Text>
			<Text style={onboardingStyles.content}>
				<Text style={fontStyles.bold}>{strings('onboarding_wizard.step3.content2')} </Text>
				{strings('onboarding_wizard.step3.content3')}
			</Text>
		</View>
	);

	render() {
		const { selectedAddress, identities, accounts, currentCurrency } = this.props;
		const account = { address: selectedAddress, ...identities[selectedAddress], ...accounts[selectedAddress] };

		return (
			<View style={styles.main}>
				<View style={styles.accountLabelContainer}>
					<AccountOverview account={account} currentCurrency={currentCurrency} onboardingWizard />
				</View>

				<View style={styles.coachmarkContainer}>
					<Coachmark
						title={strings('onboarding_wizard.step3.title')}
						content={this.content()}
						onNext={this.onNext}
						onBack={this.onBack}
						style={styles.some}
						topIndicatorPosition={'topCenter'}
						currentStep={2}
					/>
				</View>
			</View>
		);
	}
}

const mapStateToProps = state => ({
	accounts: state.engine.backgroundState.AccountTrackerController.accounts,
	currentCurrency: state.engine.backgroundState.CurrencyRateController.currentCurrency,
	selectedAddress: state.engine.backgroundState.PreferencesController.selectedAddress,
	identities: state.engine.backgroundState.PreferencesController.identities
});

const mapDispatchToProps = dispatch => ({
	setOnboardingWizardStep: step => dispatch(setOnboardingWizardStep(step))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Step3);