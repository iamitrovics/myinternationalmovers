<?php
/**
 * ACF Main Settings
 *
 * @package understrap
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if( function_exists('acf_add_options_page') ) {
	
	acf_add_options_page(array(
		'page_title' 	=> 'Theme Options',
		'menu_title'	=> 'Theme Options',
		'menu_slug' 	=> 'theme-general-settings',
		'capability'	=> 'edit_posts',
		'redirect'		=> false
	));

	acf_add_options_sub_page(array(
		'page_title' 	=> 'Header',
		'menu_title'	=> 'Header',
		'parent_slug'	=> 'theme-general-settings',
	));	

	acf_add_options_sub_page(array(
		'page_title' 	=> 'Desktop Menu Options',
		'menu_title'	=> 'Desktop Menu Options',
		'parent_slug'	=> 'theme-general-settings',
	));			

	acf_add_options_sub_page(array(
		'page_title' 	=> 'Mobile Menu Options',
		'menu_title'	=> 'Mobile Menu Options',
		'parent_slug'	=> 'theme-general-settings',
	));		

	acf_add_options_sub_page(array(
		'page_title' 	=> 'Sidebar',
		'menu_title'	=> 'Sidebar',
		'parent_slug'	=> 'theme-general-settings',
	));	

	acf_add_options_sub_page(array(
		'page_title' 	=> 'Specific Pages',
		'menu_title'	=> 'Specific Pages',
		'parent_slug'	=> 'theme-general-settings',
	));	
	
	acf_add_options_sub_page(array(
		'page_title' 	=> 'Middle Area',
		'menu_title'	=> 'Middle Area',
		'parent_slug'	=> 'theme-general-settings',
	));			

	acf_add_options_sub_page(array(
		'page_title' 	=> 'Areas We Cover',
		'menu_title'	=> 'Areas We Cover',
		'parent_slug'	=> 'theme-general-settings',
	));			

	acf_add_options_sub_page(array(
		'page_title' 	=> 'Footer',
		'menu_title'	=> 'Footer',
		'parent_slug'	=> 'theme-general-settings',
	));		

}
