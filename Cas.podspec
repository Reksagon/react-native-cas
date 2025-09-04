require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

min_ios_version_supported = "13.4"

Pod::Spec.new do |s|
  s.name         = "CAS"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platform     = :ios, min_ios_version_supported
  s.source       = { :git => "https://github.com/cleveradssolutions/CAS-ReactNative.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,cpp}"
  s.public_header_files = "ios/**/*.h"
  s.requires_arc = true
end
