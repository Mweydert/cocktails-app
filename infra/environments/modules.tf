
module "scaleway" {
  source          = "./modules/scaleway"
  access_key      = var.scaleway_access_key
  secret_key      = var.scaleway_secret_key
  organization_id = var.scaleway_organization_id
}
