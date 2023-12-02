package com.ajay.sampleApp;

import com.ajay.sampleApp.db.entities.UserEntity;
import com.ajay.sampleApp.resources.UserResource;
import com.google.inject.Guice;
import com.google.inject.Injector;
import io.dropwizard.Application;
import io.dropwizard.db.DataSourceFactory;
import io.dropwizard.hibernate.HibernateBundle;
import io.dropwizard.migrations.MigrationsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import liquibase.Liquibase;
import liquibase.database.Database;
import liquibase.database.DatabaseFactory;
import liquibase.database.jvm.JdbcConnection;
import liquibase.resource.ClassLoaderResourceAccessor;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Arrays;
import java.util.List;

public class SampleAppApplication extends Application<SampleAppConfiguration> {

    public static void main(final String[] args) throws Exception {
        new SampleAppApplication().run(args);
    }

    @Override
    public String getName() {
        return "SampleApp";
    }

    public static final List<Class<?>> RESOURCE_CLASSES = Arrays.asList(UserResource.class);

    // Create a Hibernate bundle for database access
    private final HibernateBundle<SampleAppConfiguration> hibernateBundle =
            new HibernateBundle<SampleAppConfiguration>(UserEntity.class) {
                @Override
                public DataSourceFactory getDataSourceFactory(SampleAppConfiguration configuration) {
                    return configuration.getDataSourceFactory();
                }
            };


    @Override
    public void initialize(final Bootstrap<SampleAppConfiguration> bootstrap) {
        // TODO: application initialization
        bootstrap.addBundle(new MigrationsBundle<SampleAppConfiguration>() {
            @Override
            public DataSourceFactory getDataSourceFactory(SampleAppConfiguration configuration) {
                return configuration.getDataSourceFactory();
            }

            @Override
            public String getMigrationsFileName() {
                return "db/migrations.xml";
            }
        });
        bootstrap.addBundle(hibernateBundle);
    }

    @Override
    public void run(final SampleAppConfiguration configuration,
                    final Environment environment) {
        // Initialize Liquibase and apply database changes
        try {
            Connection connection = DriverManager.getConnection(
                    configuration.getDataSourceFactory().getUrl(),
                    configuration.getDataSourceFactory().getUser(),
                    configuration.getDataSourceFactory().getPassword());

            Database database = DatabaseFactory.getInstance()
                    .findCorrectDatabaseImplementation(new JdbcConnection(connection));

            Liquibase liquibase = new Liquibase("db/migrations.xml",
                    new ClassLoaderResourceAccessor(),
                    database);

            liquibase.update("");
        } catch (Exception e) {
            // Handle any exceptions during Liquibase initialization
            e.printStackTrace();
            // Consider proper error handling and logging
        }
        Injector injector = Guice.createInjector(new SampleAppModule(configuration, hibernateBundle));
        registerResources(environment, injector);
    }

    private void registerResources(Environment environment, Injector injector){

        for ( Class<?> className : RESOURCE_CLASSES){
            environment.jersey().register(injector.getInstance(className));
        }
    }

}
