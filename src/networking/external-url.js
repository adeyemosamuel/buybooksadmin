const server_url = "https://bbip-backend.herokuapp.com"; // Production
// const server_url = "http://localhost:8058"; // Local
const server_port = ""
const api_path = "/api";


// App Properties Route...
export const getAdminCreationPropertiesUrl = server_url + server_port + api_path + "/app-properties/get-admin-creation-properties";

// User Routes...
export const loginUrl = server_url + server_port + api_path + "/user/login";
export const forgotPasswordUrl = server_url + server_port + api_path + "/user/forgot-password";
export const userRegistrationUrl = server_url + server_port + api_path + "/user/signup";
export const getUserDetailsUrl = server_url + server_port + api_path + "/user/get-current-user-details";
export const editProfileUrl = server_url + server_port + api_path + "/user/edit-profile";
export const disableUserUrl = server_url + server_port + api_path + "/user/disable-profile";
export const enableUserUrl = server_url + server_port + api_path + "/user/enable-profile/";
export const deleteProfileUrl = server_url + server_port + api_path + "/user/delete-profile";
export const getAllProfilesUrl = server_url + server_port + api_path + "/user/get-all-profiles-np/";
export const getProfileUrl = server_url + server_port + api_path + "/user/get-profile/";

// Category Routes...
export const addCategoryUrl = server_url + server_port + api_path + "/category/add";
export const editCategoryUrl = server_url + server_port + api_path + "/category/edit";
export const deleteCategoryUrl = server_url + server_port + api_path + "/category/delete/";
export const getCategoryUrl = server_url + server_port + api_path + "/category/get-category/";
export const getCategoriesWithCustomParamsUrl = server_url + server_port + api_path + "/category/filter";
export const getDeletedCategoriesUrl = server_url + server_port + api_path + "/category/get-all-deleted-categories/";
export const undoCategoryDeleteUrl = server_url + server_port + api_path + "/category/undo-delete/";

// Sub Category Routes...
export const addSubCategoryUrl = server_url + server_port + api_path + "/sub-category/add";
export const editSubCategoryUrl = server_url + server_port + api_path + "/sub-category/edit";
export const deleteSubCategoryUrl = server_url + server_port + api_path + "/sub-category/delete/";
export const getSubCategoryUrl = server_url + server_port + api_path + "/sub-category/get-sub-category/";
export const getSubCategoriesWithCustomParamsUrl = server_url + server_port + api_path + "/sub-category/filter";
export const getDeletedSubCategoriesUrl = server_url + server_port + api_path + "/sub-category/get-all-deleted-sub-categories";
export const undoSubCategoryDeleteUrl = server_url + server_port + api_path + "/sub-category/undo-delete/";

// Brand Routes...
export const addBrandUrl = server_url + server_port + api_path + "/brand/add";
export const editBrandUrl = server_url + server_port + api_path + "/brand/edit";
export const deleteBrandUrl = server_url + server_port + api_path + "/brand/delete/";
export const getBrandUrl = server_url + server_port + api_path + "/brand/get-brand/";
export const getBrandsWithCustomParamsUrl = server_url + server_port + api_path + "/brand/filter";
export const getDeletedBrandsUrl = server_url + server_port + api_path + "/brand/get-all-deleted-brands";
export const undoBrandDeleteUrl = server_url + server_port + api_path + "/brand/undo-delete/";

// Delivery Routes...
export const addDeliveryMethodUrl = server_url + server_port + api_path + "/delivery/add";
export const editDeliveryMethodUrl = server_url + server_port + api_path + "/delivery/edit";
export const getDeliveryMethodUrl = server_url + server_port + api_path + "/delivery/get-delivery-method/";
export const getAllDeliveryMethodsUrl = server_url + server_port + api_path + "/delivery/get-all-delivery-methods";
export const setDeliveryMethodInactiveUrl = server_url + server_port + api_path + "/delivery/set-inactive/";
export const setDeliveryMethodActiveUrl = server_url + server_port + api_path + "/delivery/set-active/";

// Product Format Routes...
export const createProductFormatUrl = server_url + server_port + api_path + "/product/product-format/add";
export const editProductFormatUrl = server_url + server_port + api_path + "/product/product-format/edit";
export const deleteProductFormatUrl = server_url + server_port + api_path + "/product/product-format/delete/";
export const getProductFormatUrl = server_url + server_port + api_path + "/product/product-format/get-product-format/";
export const getAllProductFormatsUrl = server_url + server_port + api_path + "/product/product-format/all";

// Product Languages Routes...
export const createProductLanguageUrl = server_url + server_port + api_path + "/product/product-language/add";
export const editProductLanguageUrl = server_url + server_port + api_path + "/product/product-language/edit";
export const deleteProductLanguageUrl = server_url + server_port + api_path + "/product/product-language/delete/";
export const getProductLanguageUrl = server_url + server_port + api_path + "/product/product-language/get-product-language/";
export const getAllProductLanguagesUrl = server_url + server_port + api_path + "/product/product-language/all";

// Product Routes...
export const createProductUrl = server_url + server_port + api_path + "/product/add";
export const editProductUrl = server_url + server_port + api_path + "/product/edit";
export const deleteProductUrl = server_url + server_port + api_path + "/product/delete/";
export const getProductUrl = server_url + server_port + api_path + "/product/get-single-product/";
export const getAllProductsWithCustomParamsUrl = server_url + server_port + api_path + "/product/filter";
export const getAllProductImagesUrl = server_url + server_port + api_path + "/product/images/get-all/";
export const deleteProductImageUrl = server_url + server_port + api_path + "/product/image/delete/";

// Order Routes...
export const getAllOrdersWithCustomParamsFilter = server_url + server_port + api_path + "/order/get-all-orders/filter";
export const getAllOrderProductsWithCustomParamsFilter = server_url + server_port + api_path + "/order/get-order-products/filter/";

// App Details Routes...
export const getAppDetailsUrl = server_url + server_port + api_path + "/app-details/get";
export const modifyAppDetailsUrl = server_url + server_port + api_path + "/app-details/manage";

// Blog Routes...
export const uploadBlogImagesUrl = server_url + server_port + api_path + "/blog/images/upload";
export const publishBlogPostUrl = server_url + server_port + api_path + "/blog/publish-post";
export const getBlogPostUrl = server_url + server_port + api_path + "/blog/post/get/";
export const getAllBlogPostsUrl = server_url + server_port + api_path + "/blog/post/all";
export const editBlogPostUrl = server_url + server_port + api_path + "/blog/edit-post";
export const deleteBlogPostUrl = server_url + server_port + api_path + "/blog/post/delete/";