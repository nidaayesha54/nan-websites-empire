<?php
/**
 * Plugin Name:       NAN Calculators
 * Plugin URI:        https://nidaayesha.com/
 * Description:       Clean Pakistan calculator shortcodes — EOBI pension, overtime, gratuity and age calculators with English/Urdu support. No tracking, no external calls.
 * Version:           1.0.0
 * Requires at least: 5.8
 * Requires PHP:      7.4
 * Author:            NAN Marketing Agency
 * Author URI:        https://nidaayesha.com/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       nan-calculators
 * Domain Path:       /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'NAN_CALC_VERSION', '1.0.0' );
define( 'NAN_CALC_URL', plugin_dir_url( __FILE__ ) );

/**
 * All UI strings, English + Urdu. Passed to JS via wp_localize_script.
 *
 * @return array
 */
function nan_calc_get_labels() {
	return array(
		'en' => array(
			'calculate'        => 'Calculate',
			'eobi_title'       => 'EOBI Pension Calculator',
			'eobi_wage'        => 'Average monthly wage (Rs)',
			'eobi_years'       => 'Years of service',
			'eobi_err'         => 'Please enter your wage and years of service.',
			'eobi_grant_title' => 'estimated one-time OLD-AGE GRANT (not monthly pension)',
			'eobi_service'     => 'Your service',
			'eobi_years_unit'  => 'years',
			'eobi_elig'       => 'Monthly pension eligibility',
			'eobi_elig_no'     => 'Not yet — needs 14.5+ years',
			'eobi_grant_hint'  => 'Workers with 2 to under 15 years of contributions get a one-time grant of one month\'s average wage per year of service.',
			'eobi_pension'     => 'estimated MONTHLY pension',
			'eobi_min_applies' => '(minimum pension applies)',
			'eobi_formula'     => 'Formula result',
			'eobi_min_label'   => 'Minimum pension (2026)',
			'eobi_each_year'   => 'Each year of service adds',
			'eobi_two_pct'     => '2% of your wage',
			'eobi_hint'        => 'Formula: (average monthly wage × years of service) ÷ 50. Below Rs 11,500 you receive the minimum.',
			'ot_title'         => 'Overtime Calculator',
			'ot_salary'        => 'Monthly salary (Rs)',
			'ot_whrs'          => 'Weekly working hours',
			'ot_hours'         => 'Overtime hours',
			'ot_err'           => 'Please enter salary and weekly hours.',
			'ot_pay_due'       => 'overtime pay due',
			'ot_hourly'        => 'Ordinary hourly rate',
			'ot_double'        => 'Overtime rate (double)',
			'ot_hours_row'     => 'Overtime hours',
			'ot_hint'          => 'Legal formula: (monthly salary × 12) ÷ (52 × weekly hours) = hourly rate; overtime = hourly × 2.',
			'grat_title'       => 'Gratuity Calculator',
			'grat_wage'        => 'Last monthly wage (Rs)',
			'grat_years'       => 'Completed years of service',
			'grat_err'         => 'Please enter wage and years of service.',
			'grat_payable'     => 'estimated gratuity payable',
			'grat_perday'      => 'Per-day wage (÷ 26)',
			'grat_rate'        => 'Rate',
			'grat_rate_val'    => '30 days wages × {y} year(s)',
			'grat_hint'        => 'Payable on resignation, termination (except misconduct), retirement or death — after 1+ year of service.',
			'age_title'        => 'Age Calculator',
			'age_dob'          => 'Date of birth',
			'age_numerals'     => 'Numerals',
			'age_ur_num'       => 'Urdu (۰۱۲۳۴۵۶۷۸۹)',
			'age_en_num'       => 'English (0123456789)',
			'age_err_empty'    => 'Please select your date of birth.',
			'age_err_future'   => 'Date of birth must be before today.',
			'age_your_age'     => 'your age',
			'age_years'        => 'years',
			'age_months'       => 'months',
			'age_days'         => 'days',
			'age_birth_day'    => 'Birth weekday',
			'age_total_days'   => 'Total days lived',
			'age_next_bday'    => 'Days to next birthday',
			'age_days_left'    => 'days left',
			'weekdays'         => array( 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ),
		),
		'ur' => array(
			'calculate'        => 'حساب کریں',
			'eobi_title'       => 'ای او بی آئی پنشن کیلکولیٹر',
			'eobi_wage'        => 'اوسط ماہانہ اجرت (روپے)',
			'eobi_years'       => 'ملازمت کے سال',
			'eobi_err'         => 'براہ کرم اپنی اجرت اور ملازمت کے سال درج کریں۔',
			'eobi_grant_title' => 'متوقع یک وقتی اولڈ ایج گرانٹ (ماہانہ پنشن نہیں)',
			'eobi_service'     => 'آپ کی ملازمت',
			'eobi_years_unit'  => 'سال',
			'eobi_elig'       => 'ماہانہ پنشن کی اہلیت',
			'eobi_elig_no'     => 'ابھی نہیں — 14.5+ سال درکار',
			'eobi_grant_hint'  => '2 سے 15 سال سے کم کنٹریبیوشن والے ورکرز کو ہر سال کی ملازمت پر ایک ماہ کی اوسط اجرت کے برابر یک وقتی گرانٹ ملتی ہے۔',
			'eobi_pension'     => 'متوقع ماہانہ پنشن',
			'eobi_min_applies' => '(کم از کم پنشن لاگو)',
			'eobi_formula'     => 'فارمولے کا نتیجہ',
			'eobi_min_label'   => 'کم از کم پنشن (2026)',
			'eobi_each_year'   => 'ہر سال کی ملازمت پر اضافہ',
			'eobi_two_pct'     => 'اجرت کا 2 فیصد',
			'eobi_hint'        => 'فارمولا: (اوسط ماہانہ اجرت × ملازمت کے سال) ÷ 50۔ 11,500 روپے سے کم ہو تو کم از کم پنشن ملتی ہے۔',
			'ot_title'         => 'اوور ٹائم کیلکولیٹر',
			'ot_salary'        => 'ماہانہ تنخواہ (روپے)',
			'ot_whrs'          => 'ہفتہ وار کام کے گھنٹے',
			'ot_hours'         => 'اوور ٹائم گھنٹے',
			'ot_err'           => 'براہ کرم تنخواہ اور ہفتہ وار گھنٹے درج کریں۔',
			'ot_pay_due'       => 'واجب الادا اوور ٹائم رقم',
			'ot_hourly'        => 'عام فی گھنٹہ اجرت',
			'ot_double'        => 'اوور ٹائم ریٹ (دوگنا)',
			'ot_hours_row'     => 'اوور ٹائم گھنٹے',
			'ot_hint'          => 'قانونی فارمولا: (ماہانہ تنخواہ × 12) ÷ (52 × ہفتہ وار گھنٹے) = فی گھنٹہ اجرت؛ اوور ٹائم = فی گھنٹہ × 2۔',
			'grat_title'       => 'گریجوٹی کیلکولیٹر',
			'grat_wage'        => 'آخری ماہانہ اجرت (روپے)',
			'grat_years'       => 'مکمل شدہ ملازمت کے سال',
			'grat_err'         => 'براہ کرم اجرت اور ملازمت کے سال درج کریں۔',
			'grat_payable'     => 'متوقع واجب الادا گریجوٹی',
			'grat_perday'      => 'یومیہ اجرت (÷ 26)',
			'grat_rate'        => 'شرح',
			'grat_rate_val'    => '30 دن کی اجرت × {y} سال',
			'grat_hint'        => 'استعفیٰ، برخاستگی (بدعنوانی کے علاوہ)، ریٹائرمنٹ یا وفات پر — 1+ سال ملازمت کے بعد واجب الادا۔',
			'age_title'        => 'عمر کیلکولیٹر',
			'age_dob'          => 'تاریخ پیدائش',
			'age_numerals'     => 'ہندسے',
			'age_ur_num'       => 'اردو (۰۱۲۳۴۵۶۷۸۹)',
			'age_en_num'       => 'انگریزی (0123456789)',
			'age_err_empty'    => 'براہ کرم تاریخ پیدائش منتخب کریں۔',
			'age_err_future'   => 'تاریخ پیدائش آج سے پہلے کی ہونی چاہیے۔',
			'age_your_age'     => 'آپ کی عمر',
			'age_years'        => 'سال',
			'age_months'       => 'ماہ',
			'age_days'         => 'دن',
			'age_birth_day'    => 'پیدائش کا دن',
			'age_total_days'   => 'کل گزارے گئے دن',
			'age_next_bday'    => 'اگلی سالگرہ میں باقی دن',
			'age_days_left'    => 'دن باقی',
			'weekdays'         => array( 'اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ' ),
		),
	);
}

/**
 * Enqueue CSS/JS only when a shortcode is present. Called from shortcode callbacks
 * (late enqueue is fine — script is registered with in_footer=true).
 */
function nan_calc_enqueue_assets() {
	static $done = false;
	if ( $done ) {
		return;
	}
	$done = true;
	wp_enqueue_style(
		'nan-calculators',
		NAN_CALC_URL . 'assets/css/nan-calculators.css',
		array(),
		NAN_CALC_VERSION
	);
	wp_enqueue_script(
		'nan-calculators',
		NAN_CALC_URL . 'assets/js/nan-calculators.js',
		array(),
		NAN_CALC_VERSION,
		true
	);
	wp_localize_script( 'nan-calculators', 'nanCalcL10n', nan_calc_get_labels() );
}

/**
 * Shared wrapper HTML for all four calculators.
 *
 * @param string $type Calculator key: eobi|overtime|gratuity|age.
 * @param string $lang 'en' or 'ur'.
 * @param string $inner Inner form HTML (already escaped).
 * @return string
 */
function nan_calc_wrap( $type, $lang, $inner ) {
	$labels = nan_calc_get_labels();
	$t      = isset( $labels[ $lang ] ) ? $labels[ $lang ] : $labels['en'];
	$title_key = array(
		'eobi'     => 'eobi_title',
		'overtime' => 'ot_title',
		'gratuity' => 'grat_title',
		'age'      => 'age_title',
	);
	$title = isset( $title_key[ $type ] ) ? $t[ $title_key[ $type ] ] : '';
	$dir   = ( 'ur' === $lang ) ? ' dir="rtl"' : '';
	$uid   = 'nan-calc-' . $type . '-' . wp_rand( 1000, 9999 );

	$html  = '<div class="nan-calc" id="' . esc_attr( $uid ) . '" data-calc="' . esc_attr( $type ) . '" data-lang="' . esc_attr( $lang ) . '"' . $dir . '>';
	$html .= '<h3 class="nan-calc-title">' . esc_html( $title ) . '</h3>';
	$html .= $inner;
	$html .= '<button type="button" class="nan-calc-btn">' . esc_html( $t['calculate'] ) . '</button>';
	$html .= '<div class="nan-calc-result" style="display:none" aria-live="polite"></div>';
	$html .= '</div>';
	return $html;
}

/**
 * One number input row.
 */
function nan_calc_field( $name, $label, $default = '', $min = '0' ) {
	return '<label class="nan-calc-row"><span>' . esc_html( $label ) . '</span>'
		. '<input type="number" name="' . esc_attr( $name ) . '" value="' . esc_attr( $default ) . '" min="' . esc_attr( $min ) . '" step="any" inputmode="decimal"></label>';
}

/**
 * Sanitize the lang attribute: only 'ur' passes, everything else is 'en'.
 */
function nan_calc_sanitize_lang( $atts ) {
	$atts = shortcode_atts( array( 'lang' => 'en' ), $atts, '' );
	$lang = strtolower( trim( $atts['lang'] ) );
	return ( 'ur' === $lang ) ? 'ur' : 'en';
}

/** [nan_eobi lang="en|ur"] */
function nan_calc_shortcode_eobi( $atts ) {
	$lang   = nan_calc_sanitize_lang( $atts );
	$labels = nan_calc_get_labels();
	$t      = $labels[ $lang ];
	nan_calc_enqueue_assets();
	$inner  = nan_calc_field( 'wage', $t['eobi_wage'] );
	$inner .= nan_calc_field( 'years', $t['eobi_years'] );
	return nan_calc_wrap( 'eobi', $lang, $inner );
}
add_shortcode( 'nan_eobi', 'nan_calc_shortcode_eobi' );

/** [nan_overtime lang="en|ur"] */
function nan_calc_shortcode_overtime( $atts ) {
	$lang   = nan_calc_sanitize_lang( $atts );
	$labels = nan_calc_get_labels();
	$t      = $labels[ $lang ];
	nan_calc_enqueue_assets();
	$inner  = nan_calc_field( 'salary', $t['ot_salary'] );
	$inner .= nan_calc_field( 'whrs', $t['ot_whrs'], '48' );
	$inner .= nan_calc_field( 'oth', $t['ot_hours'] );
	return nan_calc_wrap( 'overtime', $lang, $inner );
}
add_shortcode( 'nan_overtime', 'nan_calc_shortcode_overtime' );

/** [nan_gratuity lang="en|ur"] */
function nan_calc_shortcode_gratuity( $atts ) {
	$lang   = nan_calc_sanitize_lang( $atts );
	$labels = nan_calc_get_labels();
	$t      = $labels[ $lang ];
	nan_calc_enqueue_assets();
	$inner  = nan_calc_field( 'gwage', $t['grat_wage'] );
	$inner .= nan_calc_field( 'gyrs', $t['grat_years'] );
	return nan_calc_wrap( 'gratuity', $lang, $inner );
}
add_shortcode( 'nan_gratuity', 'nan_calc_shortcode_gratuity' );

/** [nan_age lang="en|ur"] */
function nan_calc_shortcode_age( $atts ) {
	$lang   = nan_calc_sanitize_lang( $atts );
	$labels = nan_calc_get_labels();
	$t      = $labels[ $lang ];
	nan_calc_enqueue_assets();
	$dir    = ( 'ur' === $lang ) ? ' dir="rtl"' : '';
	$inner  = '<label class="nan-calc-row"><span>' . esc_html( $t['age_dob'] ) . '</span>'
		. '<input type="date" name="dob"' . $dir . '></label>';
	$inner .= '<label class="nan-calc-row"><span>' . esc_html( $t['age_numerals'] ) . '</span>'
		. '<select name="numerals">'
		. '<option value="ur"' . ( 'ur' === $lang ? ' selected' : '' ) . '>' . esc_html( $t['age_ur_num'] ) . '</option>'
		. '<option value="en"' . ( 'ur' !== $lang ? ' selected' : '' ) . '>' . esc_html( $t['age_en_num'] ) . '</option>'
		. '</select></label>';
	return nan_calc_wrap( 'age', $lang, $inner );
}
add_shortcode( 'nan_age', 'nan_calc_shortcode_age' );

/** Load translations. */
function nan_calc_load_textdomain() {
	load_plugin_textdomain( 'nan-calculators', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
add_action( 'plugins_loaded', 'nan_calc_load_textdomain' );
