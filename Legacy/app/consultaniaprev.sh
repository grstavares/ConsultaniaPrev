#!/bin/bash
asadmin create-domain --adminport 5000 --profile developer --user admin consultaniaprev
asadmin start-domain consultaniaprev
asadmin --port 5000 --host localhost deploy /tmp/ConsultaniaV5.war