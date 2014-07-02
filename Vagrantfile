# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"
  
  config.vm.provider "virtualbox" do |v|
    v.memory = 1024
  end
  
  config.vm.define :drat do |drat|
    drat.vm.network "forwarded_port", guest: 8080, host: 8080
    drat.vm.hostname = "drat"
    drat.vm.provision :shell, :path => "provision.sh"
  end
end
