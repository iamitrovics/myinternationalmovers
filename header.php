<?php
/**
 * The header for our theme
 *
 * Displays all of the <head> section and everything up till <div id="content">
 *
 * @package UnderStrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="icon" type="image/png"  href="<?php echo get_template_directory_uri(); ?>/img/ico/favicon.png">
	<?php if( get_field('head_code_snippet', 'options') ): ?>
		<?php the_field('head_code_snippet', 'options'); ?>
	<?php endif; ?>

	<?php if ( is_singular( array('cities', 'post') ) ) { ?>
        
        <?php if( get_field('general_schema_schema', 'options') ): ?>
            <?php the_field('general_schema_schema', 'options'); ?>
        <?php endif; ?>    

    <?php } elseif (is_page_template('page-templates/reviews-template.php')) { ?>
        
        <?php if( get_field('general_schema_schema', 'options') ): ?>
            <?php the_field('general_schema_schema', 'options'); ?>
        <?php endif; ?>    

	<?php } else { ?>

        <?php if( get_field('general_schema_with_reviews', 'options') ): ?>
            <?php the_field('general_schema_with_reviews', 'options'); ?>
        <?php endif; ?>    

	<?php } ?>  

	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?> <?php understrap_body_attributes(); ?>>
<?php do_action( 'wp_body_open' ); ?>

	<?php if( get_field('body_code_snippet', 'options') ): ?>
		<?php the_field('body_code_snippet', 'options'); ?>
	<?php endif; ?>

	<div id="fixed-sidenav">
		<div id="phone-popup-wrapper">
			<a id="phone-popup" href="tel:<?php the_field('phone_number_side_cta', 'options'); ?>"><?php the_field('phone_number_side_cta', 'options'); ?></a>
		</div>
		<!-- /#phone-popup-wrapper -->
		<div class="sticky-popup">
			<div class="popup-header">
				<span class="popup-title"><?php the_field('button_label_side_quick', 'options'); ?></span>
			</div>
			<!-- /.popup-header -->
			<div class="popup-content">
				<div class="quote-form">
					<div class="quote-form-in">
						<?php the_field('form_code_gen_side', 'options'); ?>
					</div>
					<!-- /.quote-form-in -->
				</div>
			</div>
			<!-- /.popup-content -->
		</div>
		<!-- /.sticky-popup -->
	</div>
	<!-- /#fixed-sidenav -->

	<div class="menu-overlay"></div>
	<div class="main-menu-sidebar visible-xs visible-sm visible-md" id="menu">

		<header>
			<a href="javascript:;" class="close-menu-btn"><img src="<?php bloginfo('template_directory'); ?>/img/ico/close-x.svg" alt=""></a>
		</header>
		<!-- // header  -->


		<nav id="sidebar-menu-wrapper">
			<img src="<?php the_field('website_logo_general', 'options'); ?>" alt="" class="mobile-logo">
			<div id="menu">    
				<ul class="nav-links">
					<?php
					wp_nav_menu( array(
						'menu'              => 'mobile',
						'theme_location'    => 'mobile',
						'depth'             => 2,
						'container'         => false,
						'container_class'   => 'collapse navbar-collapse',
						'container_id'      => false,
						'menu_class'        => 'nav navbar-nav',
						'fallback_cb'       => 'wp_bootstrap_navwalker::fallback',
						'items_wrap' => '%3$s',
						'walker'            => new wp_bootstrap_navwalkermobile())
					);
					?>  
				</ul>
			</div>
			<!-- // menu  -->

		</nav> 
		<!-- // sidebar menu wrapper  -->

	</div>
	<!-- // main menu sidebar  -->		

	<div class="page-wrapper">
		<div id="menu_area" class="menu-area">

			<div id="top-bars">

				<?php if ( get_field('button_label_header_gen', 'options') ): ?>
					<div id="cor-notice">
						<p><?php the_field('notice_text_header', 'options'); ?> <a href="<?php the_field('button_link_header_gen', 'options'); ?>"><?php the_field('button_label_header_gen', 'options'); ?></a></p>
					</div>
				<?php else: ?>
				<?php endif; ?>	

				<?php if ( get_field('license_text_header', 'options') ): ?>
					<div id="top-license">
						<p><?php the_field('license_text_header', 'options'); ?></p>
						<div id="toggle-tl"><i class="far fa-angle-down"></i></div>
						<!-- /#toggle-tl -->
					</div>
				<?php else: ?>
				<?php endif; ?>				

			</div>
			<!-- /#top-bars -->

			<div id="menu-wrapper">
				<div class="container">
					<div class="row">
						<div class="col-md-12">
							<nav class="navbar navbar-light navbar-expand-lg mainmenu">
								<a class="navbar-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>"><img src="<?php the_field('website_logo_general', 'options'); ?>" alt=""></a>
								<!-- /.navbar-brand -->
								<div class="collapse navbar-collapse" id="navbarSupportedContent">
									<ul class="navbar-nav ml-auto">

									<?php if( have_rows('menu_items_desktop', 'options') ): ?>
										<?php while( have_rows('menu_items_desktop', 'options') ): the_row(); ?>

											<?php if (get_sub_field('item_type') == 'Single Item') { ?>
												<li><a  href="<?php the_sub_field('item_link'); ?>"><?php the_sub_field('item_label'); ?></a></li>
											<?php } elseif (get_sub_field('item_type') == 'Dropdown') { ?>
												<li class="dropdown">
													<a class="dropdown-togglex" href="<?php the_sub_field('item_link'); ?>"><?php the_sub_field('item_label'); ?></a>
													<ul class="dropdown-menu">
														<?php if( have_rows('dropdown_items') ): ?>
															<?php while( have_rows('dropdown_items') ): the_row(); ?>
																<li><a href="<?php the_sub_field('link_to_page'); ?>"><?php the_sub_field('label_dropdown'); ?></a></li>
															<?php endwhile; ?>
														<?php endif; ?>
													</ul>
												</li>
											<?php } ?>   

										<?php endwhile; ?>
									<?php endif; ?>

									</ul>
									<!-- /.navbar-nav -->

									<div id="mobile-menu--btn" class="d-lg-none">
										<a href="javascript:;">
											<span></span>
											<span></span>
											<span></span>
											<div class="clearfix"></div>
										</a>
									</div>
									<!-- // mobile  -->	

								</div>
								<!-- /.navbar-collapse -->
							</nav>
							<!-- /.mainmenu -->
						</div>
						<!-- /.col-md-12 -->
					</div>
					<!-- /.row -->
				</div>
				<!-- /.continer -->
			</div>
			<!-- /#menu-wrapper -->
		</div>
		<!-- // desktop menu  --> 		