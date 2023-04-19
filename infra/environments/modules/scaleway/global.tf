resource "scaleway_registry_namespace" "main" {
  name        = "main-registry"
  description = "Main container registry of my account"
  is_public   = true
}
