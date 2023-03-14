CMAKE_MINIMUM_REQUIRED(VERSION 3.0.0)

INCLUDE("${CMAKE_SOURCE_DIR}/version.txt")

FILE(WRITE "validation_tool/version.txt" "${version.major}.${version.minor}.${version.micro}-${version.build}")
FILE(WRITE "upp/uwtt//version.txt" "${version.major}.${version.minor}.${version.micro}-${version.build}")
FILE(WRITE "tsi/clients/tests/version.txt" "${version.major}.${version.minor}.${version.micro}-${version.build}")
FILE(WRITE "tsi/clients/tsi_test_tool/version.txt" "${version.major}.${version.minor}.${version.micro}-${version.build}")
