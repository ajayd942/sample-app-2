package com.ajay.sampleApp.core.logging;

import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;

public class LoggingInterceptor implements MethodInterceptor {

    @Override
    public Object invoke(MethodInvocation invocation) throws Throwable {
        Logger log = LoggerFactory.getLogger(invocation.getMethod().getDeclaringClass());
        String className = invocation.getMethod().getDeclaringClass().getSimpleName();
        String methodName = invocation.getMethod().getName();
        Object[] args = invocation.getArguments();

        log.info("Entering {}.{} with args: {}", className, methodName, Arrays.toString(args));

        long startTime = System.currentTimeMillis();
        try {
            Object result = invocation.proceed();
            long timeTaken = System.currentTimeMillis() - startTime;
            log.info("Exiting {}.{} (Execution Time: {} ms)", className, methodName, timeTaken);
            return result;
        } catch (Throwable t) {
            long timeTaken = System.currentTimeMillis() - startTime;
            log.error("Exception in {}.{} (Execution Time: {} ms): {}", className, methodName, timeTaken, t.getMessage());
            throw t;
        }
    }
}
