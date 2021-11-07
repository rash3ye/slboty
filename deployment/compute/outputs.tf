output "Application_Address" {
  value = "http://${aws_lb.web.dns_name}"
}

# output "instance_public_ips" {
#   value = "${data.aws_instances.web.public_ips}"
# }