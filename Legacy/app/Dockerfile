FROM        java:8-jdk

ENV         JAVA_HOME         /usr/lib/jvm/java-8-openjdk-amd64
ENV         GLASSFISH_HOME    /usr/local/glassfish5
ENV         PATH              $PATH:$JAVA_HOME/bin:$GLASSFISH_HOME/bin

RUN         apt-get update && \
            apt-get install -y curl unzip zip inotify-tools && \
            rm -rf /var/lib/apt/lists/*

ADD         glassfish5 /usr/local/glassfish5

#RUN         unzip /tmp/glassfish-5.0.zip -d /usr/local && \
#            rm -f /tmp/glassfish-5.0.zip

EXPOSE      8080 4848 8181

WORKDIR     /usr/local/glassfish5

CMD         asadmin start-domain consultaniaprev